package com.toan.server.service.impl;

import com.toan.server.service.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

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
        // 1. Tự sinh tên file độc bản bằng UUID tránh bị ghi đè trùng tên trên S3
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName != null ? originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
        String customFileName = UUID.randomUUID().toString() + fileExtension;

        try {
            // 2. Tạo yêu cầu đẩy file lên với quyền đọc công khai (Public Read) để FE dễ lấy link
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(customFileName)
                    .contentType(file.getContentType())
                    .build();

            // 3. Thực thi đẩy dữ liệu lên AWS
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // 4. Trả về đường link URL tuyệt đối của file vừa upload
            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, customFileName);

        } catch (IOException e) {
            throw new RuntimeException("Lỗi xảy ra trong quá trình upload file lên AWS S3: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        // Trích xuất lấy 'key' (tên file) từ chuỗi URL đầy đủ để xóa
        String key = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        
        s3Client.deleteObject(builder -> builder.bucket(bucketName).key(key));
    }
}