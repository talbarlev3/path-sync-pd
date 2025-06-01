export class PathConverter {
  static detectOS(path) {
    if (!path) return null;
    
    // Windows indicators
    if (path.includes('\\') || /^[A-Za-z]:/.test(path)) {
      return 'windows';
    }
    
    // macOS indicators  
    if (path.startsWith('/') || path.includes('/Users/')) {
      return 'macos';
    }
    
    return null;
  }

  static extractUsername(path, os) {
    if (!path || !os) return null;

    try {
      if (os === 'windows') {
        // Match patterns like C:\Users\username\ or C:\Users\username\OneDrive
        const match = path.match(/[A-Za-z]:\\Users\\([^\\]+)/i);
        return match ? match[1] : null;
      } else if (os === 'macos') {
        // Match patterns like /Users/username/ 
        const match = path.match(/\/Users\/([^\/]+)/);
        return match ? match[1] : null;
      }
    } catch (error) {
      console.error('Error extracting username:', error);
    }
    
    return null;
  }

  static convertPath(originalPath, sourceOS, targetOS, originalUsername, targetUsername) {
    if (!originalPath || !sourceOS || !targetOS) {
      return originalPath;
    }

    console.log('Converting path:', { originalPath, sourceOS, targetOS, originalUsername, targetUsername });

    let convertedPath = originalPath;

    // Replace username if both are provided and different
    if (originalUsername && targetUsername && originalUsername.toLowerCase() !== targetUsername.toLowerCase()) {
      if (sourceOS === 'windows') {
        convertedPath = convertedPath.replace(
          new RegExp(`\\\\Users\\\\${originalUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi'),
          `\\Users\\${targetUsername}`
        );
      } else if (sourceOS === 'macos') {
        convertedPath = convertedPath.replace(
          new RegExp(`/Users/${originalUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
          `/Users/${targetUsername}`
        );
      }
    }

    // Convert path separators and structure based on target OS
    if (sourceOS === 'windows' && targetOS === 'macos') {
      // Windows to macOS
      convertedPath = convertedPath.replace(/\\/g, '/');
      
      // Convert drive letter (C:\ -> /Users or /Volumes)
      convertedPath = convertedPath.replace(/^([A-Za-z]):\//, (match, drive) => {
        if (convertedPath.includes('/Users/')) {
          return '/';
        }
        return `/Volumes/${drive}/`;
      });
      
    } else if (sourceOS === 'macos' && targetOS === 'windows') {
      // macOS to Windows
      
      // Convert /Users/ paths to C:\Users\
      if (convertedPath.startsWith('/Users/')) {
        convertedPath = 'C:' + convertedPath.replace(/\//g, '\\');
      } else if (convertedPath.startsWith('/Volumes/')) {
        // Convert /Volumes/DriveLetter/ to DriveLetter:\
        convertedPath = convertedPath.replace(/^\/Volumes\/([A-Za-z])\//, '$1:\\');
        convertedPath = convertedPath.replace(/\//g, '\\');
      } else {
        // Generic path conversion
        convertedPath = 'C:' + convertedPath.replace(/\//g, '\\');
      }
    } else if (sourceOS === targetOS) {
      // Same OS: normalize separators and apply username changes
      if (sourceOS === 'windows') {
        convertedPath = convertedPath.replace(/\//g, '\\');
      } else if (sourceOS === 'macos') {
        convertedPath = convertedPath.replace(/\\/g, '/');
      }
    }

    console.log('Converted result:', convertedPath);
    return convertedPath;
  }

  static getCurrentUsername() {
    try {
      // Browser-based username detection is not reliable
      // This is mainly a placeholder
      return null;
    } catch (error) {
      return null;
    }
  }

  static isOneDrivePath(path) {
    if (!path) return false;
    return path.toLowerCase().includes('onedrive');
  }

  static validatePath(path) {
    if (!path || path.trim() === '') {
      return { isValid: false, error: 'Path cannot be empty' };
    }

    // Basic validation - removed overly strict character checking
    if (path.length > 1000) {
      return { isValid: false, error: 'Path is too long' };
    }

    return { isValid: true, error: null };
  }
}