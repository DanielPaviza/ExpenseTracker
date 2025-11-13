use crate::database::Database;

#[tauri::command]
pub fn load_data() -> Result<String, String> {
    eprintln!("load_data called"); // Debug logging
    let db = Database::new();
    match db.load() {
        Ok(data) => Ok(data),
        Err(_) => Ok("{}".to_string()),
    }
}

#[tauri::command]
pub fn save_data(json_data: String) -> Result<(), String> {
    eprintln!("save_data called with json_data: {}", json_data); // Debug logging
    let db = Database::new();
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