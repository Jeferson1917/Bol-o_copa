# Estágio 1: Baixar tudo e compilar (Onde o erro estava acontecendo)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia o arquivo de projeto e restaura os pacotes na marra
COPY ["BolaoApi.csproj", "./"]
RUN dotnet restore "BolaoApi.csproj"

# Copia o resto do código e publica a versão final
COPY . .
RUN dotnet publish "BolaoApi.csproj" -c Release -o /app/publish

# Estágio 2: Preparar o servidor Linux enxuto para rodar a API
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Pega o código compilado do Estágio 1 e joga aqui
COPY --from=build /app/publish .

# Comando de ignição
ENTRYPOINT ["dotnet", "BolaoApi.dll"]