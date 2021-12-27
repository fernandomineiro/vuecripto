FROM node:10

# adiciona o vue/cli
RUN npm install -g @vue/cli

# faz da pasta 'app' o diretório atual de trabalho
WORKDIR /app

# copia os arquivos 'package.json' e 'package-lock.json' (se disponível)
COPY package*.json ./

# instala dependências do projeto
RUN yarn install

# copia arquivos e pastas para o diretório atual de trabalho (pasta 'app')
COPY . .

EXPOSE 8080
