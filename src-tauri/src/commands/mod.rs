use tauri::Manager;
use std::path::PathBuf;

use crate::database::Database;

fn resolve_app_data_dir(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let mut path = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    if tauri::is_dev() {
        path.push("dev");
    }

    Ok(path)
}

#[tauri::command]
pub fn load_data(app_handle: tauri::AppHandle) -> Result<String, String> {
    eprintln!("load_data called"); // Debug logging
    let base_dir = resolve_app_data_dir(&app_handle)?;
    let db = Database::new(base_dir);
    match db.load() {
        Ok(data) => Ok(data),
        Err(_) => Ok("{}".to_string()),
    }
}

#[tauri::command]
pub fn save_data(app_handle: tauri::AppHandle, json_data: String) -> Result<(), String> {
    eprintln!("save_data called with json_data: {}", json_data); // Debug logging
    let base_dir = resolve_app_data_dir(&app_handle)?;
    let db = Database::new(base_dir);
    eprintln!("Database created, about to call save");
    let result = db.save(&json_data);
    eprintln!("save() returned: {:?}", result);
    result.map_err(|e| {
        eprintln!("Error from save: {}", e);
        e.to_string()
    })?;
    eprintln!("save_data completed successfully");
    Ok(())
}

#[tauri::command]
pub async fn get_app_data_dir(app_handle: tauri::AppHandle) -> Result<String, String> {
    let path = resolve_app_data_dir(&app_handle)?;
    Ok(path.to_string_lossy().to_string())
}
