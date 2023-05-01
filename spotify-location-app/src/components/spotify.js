export const CLIENT_ID = "6e77b58363da431b9a4092804a4b9175";
export const CLIENT_SECRET = "be00970e2f354242be8316cb93959372";

export function searchForPlaylists(query, accessToken) {
  return fetch(`https://api.spotify.com/v1/search?q=${query}&type=playlist`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data.playlists.items.map((item) => {
        return {
          name: item.name,
          id: item.id,
          imageUrl: item.images[0].url,
        };
      });
    })
    .catch((error) => console.error(error));
}

export const Spotify = {
    searchForPlaylists: function(accessToken, query) {
      const url = `https://api.spotify.com/v1/search?q=${query}&type=playlist`;
      return fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      }).then(response => response.json())
        .then(data => data.playlists.items);
    }
  };

