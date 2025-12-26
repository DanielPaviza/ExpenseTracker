// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use expense_tracker_lib::commands;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::load_data,
            commands::save_data,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
