export const sendNotification = async (token, title, body, data = {}) => {
    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=YOUR_SERVER_KEY`,
        },
        body: JSON.stringify({
          to: token,
          notification: {
            title,
            body,
          },
          data,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Bildirim gönderilemedi');
      }
  
      console.log('Bildirim gönderildi');
    } catch (error) {
      console.error('Bildirim gönderim hatası:', error);
    }
  };
  