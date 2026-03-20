FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["BrainHack.API.csproj", "./"]
RUN dotnet restore "BrainHack.API.csproj"

COPY . .
RUN dotnet publish "BrainHack.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 5282
ENV ASPNETCORE_URLS=http://+:5282

ENTRYPOINT ["dotnet", "BrainHack.API.dll"]
