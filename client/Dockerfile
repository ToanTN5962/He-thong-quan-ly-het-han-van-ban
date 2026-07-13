# Stage 1: Build ứng dụng React (Vite)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Chạy ứng dụng bằng Nginx gọn nhẹ
FROM nginx:alpine
# Copy thư mục build từ Stage 1 vào thư mục gốc của Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copy cấu hình Nginx custom (nếu có) để xử lý React Router
# Nếu ứng dụng của bạn đơn giản, dòng dưới này có thể bỏ qua, nhưng khuyên dùng:
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]