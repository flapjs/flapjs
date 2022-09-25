import LocalSaveManager from './LocalSaveManager';

//Singleton pattern (I know, I'm sorry. But we must.)
const INSTANCE = new LocalSaveManager();
export default INSTANCE;
