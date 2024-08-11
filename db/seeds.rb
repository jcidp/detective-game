puzzles = [
  {
    name: "Where's Waldo",
    description: "The classic character finding game! Your mission is to find Waldo & Wizard in a medieval carnival.",
    image_url: "https://i.pinimg.com/originals/6f/c8/b6/6fc8b6b6730f8ac917a21c1ccc6ae2f7.jpg"
  },
  {
    name: "Poke Train",
    description: "A retro pokemon scene, with pokemon travelling on a train near the country side.",
    image_url: "https://i.pinimg.com/originals/57/8a/8e/578a8e9a33833c01979e7e5fa132d367.jpg"
  },
  {
    name: "Team Rocket Disaster",
    description: "Another retro pokemon scene where Team Rocket loses pokemon they wanted to steal.",
    image_url: "https://i.pinimg.com/originals/8c/e6/9d/8ce69dc431b7660e23b958d45c860e11.jpg"
  }
]

characters = {
  "Where's Waldo" => [
    {
      name: "Waldo",
      x_range: [0.646, 0.693],
      y_range: [0.295, 0.396],
      image_url: "https://fourthavenue.org/wp-content/uploads/2022/06/waldo-transp-225x300.png"
    },
    {
      name: "Wizard",
      x_range: [0.619, 0.675],
      y_range: [0.831, 0.892],
      image_url: "https://i.pinimg.com/originals/f6/db/5e/f6db5e93e54ea7dc89af0e902b4bacc5.gif"
    }
  ],
  "Poke Train" => [
    {
      name: "Odish",
      x_range: [0.679, 0.714],
      y_range: [0.279, 0.313],
      image_url: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/043.png"
    },
    {
      name: "Dugtrio",
      x_range: [0.153, 0.178],
      y_range: [0.257, 0.279],
      image_url: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/051.png"
    },
    {
      name: "Squirtle",
      x_range: [0.82, 0.855],
      y_range: [0.468, 0.505],
      image_url: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/007.png"
    }
  ],
  "Team Rocket Disaster" => [
    {
      name: "Nidorino",
      x_range: [0.103, 0.164],
      y_range: [0.026, 0.08],
      image_url: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/033.png"
    },
    {
      name: "Gloom",
      x_range: [0.186, 0.235],
      y_range: [0.789, 0.83],
      image_url: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/044.png"
    },
    {
      name: "Golbat",
      x_range: [0.642, 0.678],
      y_range: [0.253, 0.286],
      image_url: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/042.png"
    }
  ]
}

puzzles.each do |puzzle|
  new_puzzle = Puzzle.find_or_create_by!(puzzle)
  characters[puzzle[:name]].each do |character|
    Character.find_or_create_by!(**character, puzzle_id: new_puzzle.id)
  end
end