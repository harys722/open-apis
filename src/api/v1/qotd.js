const { checkApiKey } = require('../../data/auth');
import data from '../../data/codesave';

const { emojis } = data;

export default function handler(req, res) {
  // Authorization check
  if (!checkApiKey(req, res)) {
    return; // Stop processing if not authorized
  }

  let { count } = req.query;
  let emojiCount = 1;

  if (count !== undefined) {
    const parsedCount = parseInt(count, 10);
    if (!isNaN(parsedCount)) {
      if (parsedCount < 1) {
        emojiCount = 1;
      } else if (parsedCount > 5) {
        emojiCount = 5;
      } else {
        emojiCount = parsedCount;
      }
    }
  }

  const { emoji } = req.query;

  if (emoji) {
    // Find specific emoji
    const found = emojis.find(e => e.emoji === emoji);
    if (!found) {
      return res.status(404).json({ error: "Emoji not found." });
    }
    return res.json({
      ...found,
      info: {
        credits: "Made by harys722, available only for cool people.",
        website: "https://harys.is-a.dev"
      }
    });
  } else {
    const shuffledEmojis = [...emojis].sort(() => 0.5 - Math.random());
    const selectedEmojis = shuffledEmojis.slice(0, emojiCount);
    return res.json({
      emojis: selectedEmojis,
      info: {
        credits: "Made by harys722, available for cool everyone.",
        support: "https://harys.is-a.dev/api"
      }
    });
  }
}
