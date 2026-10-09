# mrbazingah.github.io

My game development portfolio, hosted on GitHub Pages at <https://mrbazingah.github.io>.

It's built with [Jekyll](https://jekyllrb.com/), which GitHub Pages runs automatically on every push. There's no build step to set up. Everything is plain HTML and CSS, with a few `{{ curly brace }}` tags that fill in each game's details.

## Where things are

| Path | What it is |
| --- | --- |
| `_projects/` | One file per project. Its `category:` puts it on the School work or Personal projects page. |
| `_templates/new-project.html` | Copy this to add a new project. |
| `school-work.html`, `personal-projects.html` | The two project pages. They fill themselves from `_projects/`. |
| `index.html` | Home page: intro plus links to the two project pages. |
| `about.html` | About page. |
| `_layouts/` | Page frames: `default.html` (header and footer) and `category.html` (project pages). |
| `_includes/` | Reusable pieces: `project-row.html` (one project) and `media.html` (preview or placeholder). |
| `assets/css/style.css` | All styling. Colours and fonts are at the top in `:root`. |
| `assets/js/site.js` | Plays preview clips while they're on screen, and opens "How it works" from a link. |
| `_config.yml` | Site title, description and links (GitHub, itch.io, email, LinkedIn). |

## Adding a new project

1. Copy `_templates/new-project.html` into `_projects/` and rename it, e.g. `_projects/my-new-game.html`.
2. Set `category: school` or `category: personal`, and `order:` for its position on that page.
3. Write a short `summary:` and fill in the other fields. Anything left out is hidden.
4. Optional: write about how it works below the `---`. It appears in a fold-out "How it works" section under the row.
5. Commit and push.

You can link straight to a write-up, e.g. `https://mrbazingah.github.io/personal-projects/#pathfinding`. The section opens by itself.

## Adding the preview GIF

Put it in `assets/projects/<project-name>/`, then uncomment the `preview:` line at the top of the project's file:

```yaml
preview: /assets/projects/skit-gubbe/preview.gif
preview_alt: Playing a round against the AI
```

Until a project has a preview, it shows its title on a dark coloured background (set with `tint:`).

- **Size:** 16:9, about 960×540. Keep it short, 5–10 seconds, and pick a moment that loops well.
- **GIF or clip:** GIFs work, but they get big fast. A `.webm` or `.mp4` clip looks better at a fraction of the size, and visitors can pause it. Use the same `preview:` field for either.
- **Recording:** [OBS](https://obsproject.com/) for video, [ScreenToGif](https://www.screentogif.com/) or ShareX for GIFs.

Making a clip from a recording with [ffmpeg](https://ffmpeg.org/):

```sh
ffmpeg -i recording.mp4 -ss 00:00:05 -t 8 -vf scale=960:-2 -an -c:v libvpx-vp9 -crf 38 -b:v 0 preview.webm
```

(`-ss` is where to start, `-t` is how many seconds to keep, `-an` removes the sound.) Or a GIF:

```sh
ffmpeg -i recording.mp4 -ss 00:00:05 -t 6 -vf "fps=15,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" preview.gif
```

## Previewing locally (optional)

You can also just push and check the live site. To preview on your own computer, install Ruby, then:

```sh
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000>. The page reloads when you save a file.
