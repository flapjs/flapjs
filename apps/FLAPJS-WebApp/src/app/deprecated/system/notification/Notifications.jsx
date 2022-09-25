import NotificationManager from './NotificationManager';

//Singleton pattern (I know, I'm sorry. But we must.)
const INSTANCE = new NotificationManager();
export default INSTANCE;
