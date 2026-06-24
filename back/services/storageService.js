// ============================================================
// Servicio de Almacenamiento (Firebase Storage)
// ============================================================
// Funciones para subir, obtener y eliminar archivos (imágenes)
// del almacenamiento en la nube de Firebase.
// ============================================================

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { storage } from "../config/firebase";

// ─── Subir un archivo ────────────────────────────────────────
// folder: la carpeta dentro de Storage (ej. "destinos", "blog", "avatars")
// file:   el objeto File del input o drag-and-drop
// Retorna la URL pública de descarga.
export const uploadFile = async (folder, file) => {
  const uniqueName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `${folder}/${uniqueName}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

// ─── Obtener la URL de un archivo ────────────────────────────
export const getFileURL = async (filePath) => {
  const storageRef = ref(storage, filePath);
  return await getDownloadURL(storageRef);
};

// ─── Eliminar un archivo ─────────────────────────────────────
export const deleteFile = async (filePath) => {
  const storageRef = ref(storage, filePath);
  await deleteObject(storageRef);
};

// ─── Listar archivos de una carpeta ──────────────────────────
export const listFiles = async (folder) => {
  const folderRef = ref(storage, folder);
  const result = await listAll(folderRef);
  const urls = await Promise.all(
    result.items.map((itemRef) => getDownloadURL(itemRef))
  );
  return urls;
};
