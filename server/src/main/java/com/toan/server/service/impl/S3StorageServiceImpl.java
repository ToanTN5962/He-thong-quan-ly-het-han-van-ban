package com.toan.server.service.impl;

import com.toan.server.service.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import java.util.stream.Collectors;

import java.io.IOException;
import java.util.UUID;
import java.util.Map;

@Service
public class S3StorageServiceImpl implements StorageService {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    public S3StorageServiceImpl(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public String uploadFile(MultipartFile file) {
        // Sinh tên file bằng UUID tránh bị ghi đè trùng tên
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName != null ? originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
        String storedName = UUID.randomUUID().toString() + fileExtension;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(storedName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, storedName);

        } catch (IOException e) {
            throw new RuntimeException("Lỗi xảy ra trong quá trình upload file lên AWS S3: " + e.getMessage());
        }
    }

    @Override
    public java.util.List<String> listAllFiles() {
        ListObjectsV2Request listObjectsV2Request = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .build();

        ListObjectsV2Response listObjectsV2Response = s3Client.listObjectsV2(listObjectsV2Request);

        return listObjectsV2Response.contents().stream()
                .map(s3Object -> String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, s3Object.key()))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteFile(String fileUrl) {
        // Trích xuất lấy 'key' (tên file) từ chuỗi URL đầy đủ để xóa
        String key = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        
        s3Client.deleteObject(builder -> builder.bucket(bucketName).key(key));
    }
}