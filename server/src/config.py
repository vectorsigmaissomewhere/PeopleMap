# This settings enable us to read environment variables from a .env file and ignore any extra variables that are not defined in the Settings class. This is useful for keeping our configuration organized and secure, especially when dealing with sensitive information like database URLs.
from pydantic_settings import BaseSettings, SettingsConfigDict 

class Settings(BaseSettings):
    DATABASE_URL: str 
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

Config = Settings()