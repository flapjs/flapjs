import Notifications from 'deprecated/system/notification/Notifications';
import LocalSave from 'deprecated/system/localsave/LocalSave';
import Config from 'deprecated/config';

class Tutorial
{
  constructor()
  {
    this.app = null;
  }

  start(app)
  {
    if (LocalSave.getStringFromStorage("skipWelcome") !== "true")
    {
      Notifications.addMessage(I18N.toString("message.tutorial.1"));
      Notifications.addMessage(I18N.toString("message.intro.2"));
    }
  }
}

export default Tutorial;
