use std::fs;
use std::path::{Path, PathBuf};
use anyhow::{Result, Context};

const DB_FILENAME: &str = "expenseTrackerDb.json";

#[derive(Debug)]
pub struct Database {
    file_path: PathBuf,
}

impl Database {
    pub fn new() -> Self {
        let path = Self::get_db_path()
            .expect("Failed to determine database path");
        
        Database {
            file_path: path,
        }
    }

    pub fn new_safe() -> Result<Self> {
        let path = Self::get_db_path()?;
        eprintln!("Database path will be: {}", path.display());
        Ok(Database {
            file_path: path,
        })
    }

    fn get_db_path() -> Result<PathBuf> {
        let mut path = if cfg!(debug_assertions) {
            // Development: use project root
            std::env::current_dir()
                .with_context(|| "Failed to get current directory")?
        } else {
            // Production: use executable directory
            std::env::current_exe()
                .with_context(|| "Failed to get executable path")?
                .parent()
                .with_context(|| "Failed to get executable directory")?
                .to_path_buf()
        };
        
        path.push(DB_FILENAME);
        Ok(path)
    }

    pub fn load(&self) -> Result<String> {
        if !self.exists() {
            return Err(anyhow::anyhow!("Database file does not exist"));
        }
        let content = fs::read_to_string(self.get_path())
            .with_context(|| format!("Failed to read file: {}", self.get_path().display()))?;
        Ok(content)
    }

    #[inline(never)]
    pub fn save(&self, data: &str) -> Result<()> {
        let path = self.get_path();
        eprintln!("Saving to path: {}", path.display());
        if let Some(parent) = path.parent() {
            eprintln!("Ensuring parent dir exists: {}", parent.display());
            fs::create_dir_all(parent)
                .with_context(|| format!("Failed to create directories for: {}", path.display()))?;
        }
        eprintln!("Writing data: {}", data);
        fs::write(path, data)
            .with_context(|| format!("Failed to write to file: {}", path.display()))?;
        eprintln!("Save complete");
        Ok(())
    }

    pub fn exists(&self) -> bool {
        self.file_path.exists()
    }
    
    pub fn get_path(&self) -> &Path {
        &self.file_path
    }
}