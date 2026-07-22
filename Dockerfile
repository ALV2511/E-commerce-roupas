FROM php:8.2-apache

# Instala suporte ao PostgreSQL (Supabase)
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Copia os arquivos do projeto para o Apache
COPY . /var/www/html/

# Habilita a porta padrão
EXPOSE 80
