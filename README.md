# mrbazingah.github.io

My game development portfolio, hosted on GitHub Pages at <https://mrbazingah.github.io>.

It's built with [Jekyll](https://jekyllrb.com/), which GitHub Pages runs automatically on every push. There's no build step to set up. Everything is plain HTML and CSS, with a few `{{ curly brace }}` tags that fill in each game's details.

## Where things are

| Path | What it is |
| --- | --- |
| `_games/` | One file per game. Each file becomes a page at `/games/<file-name>/`. |
| `_experiments/` | Smaller projects and tech experiments, same format as games. |
| `_templates/new-game.html` | Copy this to add a new game. |
| `index.html` | Home page. The game grid fills itself from `_games/`. |
| `about.html` | About page. |
| `_layouts/` | The page frames: `default.html` (header and footer) and `project.html` (game pages). |
| `_includes/` | Reusable pieces: game cards, media, gallery, facts row. |
| `assets/css/style.css` | All styling. Colours and fonts are at the top in `:root`. |
| `assets/js/site.js` | Tabs, the systems sidebar, hover-to-play clips, gallery lightbox. |
| `_config.yml` | Site title, description and links (GitHub, itch.io, email, LinkedIn). |

## Adding a new game

1. Copy `_templates/new-game.html` into `_games/` and rename it, e.g. `_games/my-new-game.html`.
2. Fill in the fields at the top (title, tagline, tags, links...). Anything left out is hidden.
3. Set `order:` to where it should appear in the list (1 = first).
4. Write the tabs. Every `<section class="panel" data-tab="Name">` becomes a tab.
5. Commit and push. The game appears on the home page.

To change which game is featured at the top of the home page, move `featured: true` to that game's file.

## Adding screenshots and footage

Put media in `assets/games/<game-name>/`, then uncomment the matching lines at the top of the game's file:

```yaml
cover: /assets/games/skit-gubbe/cover.jpg        # card image and share preview
clip: /assets/games/skit-gubbe/clip.webm         # plays on hover, autoplays on the game page
gallery:
  - src: /assets/games/skit-gubbe/shot-01.jpg
    caption: Opening hand
```

Until a game has a cover, it shows its title on a dark coloured background (set with `tint:`).

| Asset | Size | Notes |
| --- | --- | --- |
| Cover | 1280×720 (16:9), JPG | A moment that shows what the game is. Not the menu. |
| Screenshots | 1280×720 or 1920×1080, JPG | 4–8 per game, each showing something different. |
| Clip | 10–30 s, 1280 wide, WebM or MP4, under ~4 MB | Muted and looping, so pick a moment that loops well. |
| System visuals | GIF, PNG or short WebM | E.g. A* drawn with Gizmos, a win-rate graph from training. |

Recording: [OBS](https://obsproject.com/) for video, [ScreenToGif](https://www.screentogif.com/) or ShareX for short clips.
Shrinking a recording into a clip with [ffmpeg](https://ffmpeg.org/):

```sh
ffmpeg -i recording.mp4 -ss 00:00:05 -t 20 -vf scale=1280:-2 -an -c:v libvpx-vp9 -crf 36 -b:v 0 clip.webm
```

(`-ss` is where to start, `-t` is how many seconds to keep, `-an` removes the sound.)

To show a playable WebGL build right on the game page instead of the cover, set `embed:` to the build's iframe URL.

## Previewing locally (optional)

You can also just push and check the live site. To preview on your own computer, install Ruby, then:

```sh
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000>. The page reloads when you save a file.
