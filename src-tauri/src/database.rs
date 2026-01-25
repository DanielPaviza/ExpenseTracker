use std::fs;
use std::path::{Path, PathBuf};

use anyhow::{Context, Result};

pub const DATA_FILE_NAME: &str = "expenseTrackerDb.json";
pub const SETTINGS_FILE_NAME: &str = "settings.json";

#[derive(Debug)]
pub struct JsonStore {
    file_path: PathBuf,
}

impl JsonStore {
    pub fn new(base_path: PathBuf, file_name: impl AsRef<Path>) -> Self {
        let file_path = base_path.join(file_name);
        JsonStore { file_path }
    }

    pub fn load(&self) -> Result<String> {
        let path = self.path();
        if !self.exists() {
            return Err(anyhow::anyhow!("Data file does not exist"));
        }
        let content = fs::read_to_string(path)
            .with_context(|| format!("Failed to read file: {}", path.display()))?;
        Ok(content)
    }

    #[inline(never)]
    pub fn save(&self, data: &str) -> Result<()> {
        let path = self.path();
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

    pub fn path(&self) -> &Path {
        &self.file_path
    }
}