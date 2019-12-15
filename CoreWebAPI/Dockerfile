FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /app

# copy csproj and restore as distinct layers
COPY *.sln .
COPY API/*.csproj ./API/
COPY Application/*.csproj ./Application/
COPY Domain/*.csproj ./Domain/
COPY Persistence/*.csproj ./Persistence/
RUN dotnet restore

COPY API/. ./API/
COPY Application/. ./Application/
COPY Domain/. ./Domain/
COPY Persistence/. ./Persistence/
WORKDIR /app/API
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS runtime
WORKDIR /app
COPY --from=build /app/API/out ./
ENTRYPOINT ["dotnet", "API.dll"]