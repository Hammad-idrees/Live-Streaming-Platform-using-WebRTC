// hls.js
function getPlaylistUrl(streamKey) {
  return `/hls/${streamKey}/index.m3u8`;
}

function parsePlaylist(playlistContent) {
  // Placeholder: Parse HLS playlist content
  return playlistContent
    .split("\n")
    .filter((line) => line && !line.startsWith("#"));
}

module.exports = { getPlaylistUrl, parsePlaylist };
