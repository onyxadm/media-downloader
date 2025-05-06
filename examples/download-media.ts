import { decryptWhatsAppMedia } from '../src';

const documentPayload = {
    "message": {
        "documentMessage": {
          "url": "https://mmg.whatsapp.net/v/t62.7119-24/29988859_1727871258114151_8080394043332106946_n.enc?ccb=11-4&oh=01_Q5Aa1QEeWPSQDAJZNESdmPCShtEplYO_wBSpgdQdgjvK-3eOBA&oe=6841FE6F&_nc_sid=5e03e0&mms3=true",
          "mimetype": "image/jpeg",
          "title": "cat",
          "fileSha256": "KTuVFyxDc6mTm4GXPlO3Z911Wd8RBeTrPLSWAEdqW8M=",
          "fileLength": "25241",
          "mediaKey": "oh5knoYn4W0F0zeEirn49wTgIfcgQnG6YKm5t3nsfpg=",
          "fileName": "cat.jpeg",
          "fileEncSha256": "sqKgxpshaD+vUjPaxPI4KsTUXEUT3CIFdURcuuffeEM=",
          "directPath": "/v/t62.7119-24/29988859_1727871258114151_8080394043332106946_n.enc?ccb=11-4&oh=01_Q5Aa1QEeWPSQDAJZNESdmPCShtEplYO_wBSpgdQdgjvK-3eOBA&oe=6841FE6F&_nc_sid=5e03e0",
          "mediaKeyTimestamp": "1746571519",
          "contactVcard": false,
          "contextInfo": {
            "expiration": 0,
            "ephemeralSettingTimestamp": "1745509478"
          }
        }
    }
};

const imagePayload = {
"message": {
    "imageMessage": {
      "url": "https://mmg.whatsapp.net/o1/v/t62.7118-24/f2/m269/AQMFlzf1f1E8QmMGyUiw8Mi5DRi1GoSdSHJZTtsPL4mSwG9RK-uTQeWDf-cftGkRT22sES0FOzumngz1IUaCQuvIKfEQpXr7nLMAviIEjA?ccb=9-4&oh=01_Q5Aa1QG2LmTVB7ChQcgm7L1P1bRDiF5cUQ68UMpIPoMh5MiOTw&oe=68420B87&_nc_sid=e6ed6c&mms3=true",
      "mimetype": "image/jpeg",
      "fileSha256": "rK+X0Y/OSDj4NEPAZJi+FjlRs/Vp6BBHr4rmEqKOFKw=",
      "fileLength": "57784",
      "height": 712,
      "width": 1280,
      "mediaKey": "DAwEr3EtfY0hkQp8csfN1QmynB+RMuhmJzCWT9YcAkU=",
      "fileEncSha256": "MRlZIM9TmqGTKtBlUE4doL4fi9+uEI8W5/W3l5TAN00=",
      "directPath": "/o1/v/t62.7118-24/f2/m269/AQMFlzf1f1E8QmMGyUiw8Mi5DRi1GoSdSHJZTtsPL4mSwG9RK-uTQeWDf-cftGkRT22sES0FOzumngz1IUaCQuvIKfEQpXr7nLMAviIEjA?ccb=9-4&oh=01_Q5Aa1QG2LmTVB7ChQcgm7L1P1bRDiF5cUQ68UMpIPoMh5MiOTw&oe=68420B87&_nc_sid=e6ed6c",
      "mediaKeyTimestamp": "1746571582",
      "jpegThumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wgARCABIAEgDASIAAhEBAxEB/8QAGgAAAwEBAQEAAAAAAAAAAAAAAAMEAgUBBv/EABcBAQEBAQAAAAAAAAAAAAAAAAECAAP/2gAMAwEAAhADEAAAAIKUP6DKuczncUfU5qGk7Sk0SXTU8/obfBrndUe1uxhnibHEtMbJ+m2tmsKaZ2abdNeGyBXP+g+e6DN4Y5iHzC/1nmpx6QUcUKxQFS6AM9DQRuwBR//EABsRAQEAAgMBAAAAAAAAAAAAAAEAAiEQESAx/9oACAECAQE/ACydxwz86nGDXhiTyTd74Zgv/8QAGxEAAgMBAQEAAAAAAAAAAAAAAAECEBExIRL/2gAIAQMBAT8Al0glg1XxvpIi/MG61khdH0ymLpK3zRDem1//xAAlEAACAgICAwEAAQUAAAAAAAABAgADESESMQQiQQUQEzJRYXH/2gAIAQEAAT8A/PrDu2T0JSlosOc8ZUXAIfW56tXgz9CjjeW+GHRitO5U3qRPzQeLnHfULvQCbDkHqJYz5bsfInkXMCFXqWh7a+T6Ilw9pnj3A2p4KcmLHYnioqIePU8+zLBR8lNwRQDDaW2hllvpx+yzGTCMwgjqePeatHMGKq8Z3HBdyzGP6yplOskGEgWEfDLFIbOP4xkxqBxBltoYECcyY3sMSsH+pLARYNzlrBhoFmCoxF8cDuccriWWAqTgAxSZkyjdnUvQg5xO5WWGB9hAY97EXXc/a8QeLahr/tIi5mTKWw+ZeMoSDEHJgMxlsr2d4+xLWwMDGfsrbl2cz9qtrPDBxtT3Fz8g5ShQT7S1CqkDcq1YCfhljFx/qKA/qujFrCCLe1tLJbvIxLK+FpHyD/spGo4IQnEGm3KPHu8io2Vj1WJVvA7nifmqED3bP+J///4AAwD/2Q==",
      "contextInfo": {
        "expiration": 0,
        "ephemeralSettingTimestamp": "1745509478"
      },
      "firstScanSidecar": "406wXZWsx9DmKg==",
      "firstScanLength": 8654,
      "scansSidecar": "406wXZWsx9DmKjZG5GunZRoP3GQXK+VZWCX+q/XzZjSY5ZJyGNMEPA==",
      "scanLengths": [
        8654,
        19692,
        9746,
        19690
      ],
      "midQualityFileSha256": "RXOst4sQgrJfJAsaBW2TBQ05qMvdKzGeWl96wH0KHgI=",
      "imageSourceType": "USER_IMAGE"
    }
}
}

const videoPayload = {
"message": {
    "videoMessage": {
      "url": "https://mmg.whatsapp.net/v/t62.7161-24/21318618_1712004082761695_2717220001587443157_n.enc?ccb=11-4&oh=01_Q5Aa1QFxnqwi3sfYfI1kmh78YLqNh7NBrxO1KQxa6Q3Fxx16mw&oe=6841E7D6&_nc_sid=5e03e0&mms3=true",
      "mimetype": "video/mp4",
      "fileSha256": "F1m8mwADyEoOyoISWiLCCUvhmvTfdXIfiF6SPynEDCk=",
      "fileLength": "59419",
      "seconds": 1,
      "mediaKey": "mhSJoB7DoRNBeZKSljhXDQBk4d42TMx5vIpZ6C37Y24=",
      "height": 288,
      "width": 368,
      "fileEncSha256": "Si7jn8lxsjOkuMJBu2JPFaZUzk58MSdSKzSimhgT9SQ=",
      "directPath": "/v/t62.7161-24/21318618_1712004082761695_2717220001587443157_n.enc?ccb=11-4&oh=01_Q5Aa1QFxnqwi3sfYfI1kmh78YLqNh7NBrxO1KQxa6Q3Fxx16mw&oe=6841E7D6&_nc_sid=5e03e0",
      "mediaKeyTimestamp": "1746571654",
      "jpegThumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wgARCABIAEgDASIAAhEBAxEB/8QAGgABAAMBAQEAAAAAAAAAAAAAAAIDBAEFBv/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/aAAwDAQACEAMQAAAA+lAAAAARzmphma0YFqmRYDzuRlnSMemjVh9CzsIcspXIzU+t5Szpskts9GdNFE4pNJU+AB0AAH//xAAUEQEAAAAAAAAAAAAAAAAAAABA/9oACAECAQE/AE//xAAYEQACAwAAAAAAAAAAAAAAAAABIBARMP/aAAgBAwEBPwBqYyMv/8QAJxAAAgIBAwQCAQUAAAAAAAAAAQIAAxESITEEEBNRQWEiIzJAQlL/2gAIAQEAAT8A/lu6oMscCP1i/wBFJlnWWafxTedH1JsJSzZozqn7jiG9OBufqeY/4MW1TtwfvtZY1z5YYUcDuzBSCDhhxHYW+MjcmV1hBxv2srVxvsfcqNi3eMsTK21qDx2Cv5CdW3qFATqbkTos+XJ4+IYlTq7NrzngepbVY+nD6cH4gGOoHvEt6d6mJQZUw2kNpK7wHMs1ZG+0o/VTAXSV4MF1gfRgHHzFbI+5fc9Z42MpTH5sckw8S5HexiB8ypGC7g5mjLrlfmBQi7DECMULgb5nThgCSMZnWIWQY5lQIrUHnHbSPQmkeppHrtjHbGe3//4AAwD/2Q==",
      "contextInfo": {
        "expiration": 0,
        "ephemeralSettingTimestamp": "1745509478"
      },
      "streamingSidecar": "/VMFcrID8FW2yQ=="
    }
}
}

async function testDownloads() {
  try {
    console.log('📄 Baixando documento...');
    const docResult = await decryptWhatsAppMedia(documentPayload, 'downloads');
    console.log('✅ Documento baixado:', docResult);

    console.log('\n🖼️ Baixando imagem...');
    const imageResult = await decryptWhatsAppMedia(imagePayload, 'downloads');
    console.log('✅ Imagem baixada:', imageResult);

    console.log('\n🎥 Baixando vídeo...');
    const videoResult = await decryptWhatsAppMedia(videoPayload, 'downloads');
    console.log('✅ Vídeo baixado:', videoResult);

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testDownloads(); 