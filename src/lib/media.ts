const media = {
  contactos: {
    name: 'contactos',
    1: 'https://res.cloudinary.com/thing/image/upload/f_auto,q_auto:good/v1703727135/assets/image/local/localVilaLisboa.avif',
    2: 'https://res.cloudinary.com/thing/image/upload/f_auto,q_auto:good/v1703727135/assets/image/local/localVilaLisboa1.avif',
  },
  servicos: {
    name: 'servicos',
    1: 'https://res.cloudinary.com/thing/image/upload/f_auto,q_auto:good/v1703727135/assets/image/local/servicos.avif',
    2: 'https://res.cloudinary.com/thing/image/upload/f_auto,q_auto:good/v1703727135/assets/image/local/servicos1.avif',
  },
};

// Transforma um objeto de URLs em um objeto com chaves mais simples (apenas os nomes das imagens)
function getMediaObject(media: any) {
  const result: any = {};
  for (const category in media) {
    if (Object.prototype.hasOwnProperty.call(media, category)) {
      const categoryData = media[category];
      for (const key in categoryData) {
        if (Object.prototype.hasOwnProperty.call(categoryData, key) && key !== 'name') {
          result[key] = categoryData[key];
        }
      }
    }
  }
  return result;
}

export const img = getMediaObject(media);
