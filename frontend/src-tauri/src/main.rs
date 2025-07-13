// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, Stdio, Child};
use std::thread;
use std::sync::{Arc, Mutex};

#[tauri::command]
fn start_backend() -> Result<String, String> {
    thread::spawn(|| {
        // Get the current executable directory
        let exe_dir = std::env::current_exe()
            .ok()
            .and_then(|path| path.parent().map(|p| p.to_path_buf()))
            .unwrap_or_else(|| std::env::current_dir().unwrap());
        
        // Navigate to backend directory (relative to project root)
        let backend_dir = exe_dir
            .parent()
            .and_then(|p| p.parent())
            .and_then(|p| p.parent())
            .map(|p| p.join("backend"))
            .unwrap_or_else(|| std::path::PathBuf::from("../../backend"));
            
        println!("Trying to start backend from: {:?}", backend_dir);
        
        let output = Command::new("python3")
            .arg("main.py")
            .current_dir(&backend_dir)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn();
            
        match output {
            Ok(mut child) => {
                println!("Backend started successfully");
                let _ = child.wait();
            }
            Err(e) => {
                eprintln!("Failed to start backend: {}", e);
                // Try with python instead of python3
                let output2 = Command::new("python")
                    .arg("main.py")
                    .current_dir(&backend_dir)
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .spawn();
                    
                match output2 {
                    Ok(mut child) => {
                        println!("Backend started successfully with python");
                        let _ = child.wait();
                    }
                    Err(e2) => {
                        eprintln!("Failed to start backend with python: {}", e2);
                    }
                }
            }
        }
    });
    
    Ok("Backend starting...".to_string())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    // Shared state to track backend process
    let backend_process: Arc<Mutex<Option<Child>>> = Arc::new(Mutex::new(None));
    let backend_process_clone = backend_process.clone();
    
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, start_backend])
        .setup(move |_app| {
            let backend_process = backend_process_clone.clone();
            
            // Start backend automatically when app starts
            // When running from src-tauri, we need to go up to frontend, then up to project root, then into backend
            let backend_dir = std::env::current_dir()
                .unwrap()
                .parent()  // from src-tauri to frontend
                .unwrap()
                .parent()  // from frontend to project root
                .unwrap()
                .join("backend");
            
            println!("Starting backend from: {:?}", backend_dir);
            
            // Try different Python commands in order of preference
            let python_commands = ["python3", "python", "python3.12", "python3.11", "python3.10"];
            let mut child = None;
            
            for cmd in &python_commands {
                match Command::new(cmd)
                    .arg("main.py")
                    .current_dir(&backend_dir)
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .spawn()
                {
                    Ok(process) => {
                        println!("Backend started successfully with {}", cmd);
                        child = Some(process);
                        break;
                    }
                    Err(e) => {
                        println!("Failed to start backend with {}: {}", cmd, e);
                        continue;
                    }
                }
            }
            
            match child {
                Some(process) => {
                    *backend_process.lock().unwrap() = Some(process);
                }
                None => {
                    eprintln!("Failed to start backend: No suitable Python interpreter found");
                }
            }
            
            Ok(())
        })
        .on_window_event(move |_window, event| {
            match event {
                tauri::WindowEvent::CloseRequested { .. } => {
                    println!("Window close requested, terminating backend...");
                    
                    // Kill the backend process
                    if let Ok(mut process_guard) = backend_process.lock() {
                        if let Some(mut process) = process_guard.take() {
                            let _ = process.kill();
                            let _ = process.wait();
                            println!("Backend process terminated");
                        }
                    }
                    
                    // Exit the entire application
                    std::process::exit(0);
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}