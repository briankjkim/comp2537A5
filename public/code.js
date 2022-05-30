secondCard = undefined
firstCard = undefined

cardHasBeenFlipped = false


pokemonGridImages = ''

function processPokeResp(data) {
    console.log(data.id)
    pokemonGridImages += ` 
      <div class="card">
      <img id="${data.id}" class="front_face" src="${data.sprites.other["official-artwork"].front_default}">
      <img id="${data.id}" class="back_face" src="back.jpg">
      </div>`
}


async function loadPokemonImages() {
    for (i = 1; i <= 4; i++) { 
        // 1- generate a random number for Pokemon ID so that images can be loaded
        pokemonRandomID = Math.floor(Math.random() * 33) + 1

        // 2- initialize an AJAX request to my heroku api server
        await $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonRandomID}`,
            success: processPokeResp
        })

        }
        pokemonGridImages += `</div>`    
    $("#game_grid").html(pokemonGridImages);
    $("#game_grid").append(pokemonGridImages);
}


function setup(){
    loadPokemonImages();

    $("#game_grid").on("click", ".card", function() {
        $(this).toggleClass("flip")

        if(!cardHasBeenFlipped){
            // this is the first card
            firstCard = $(this).find('.front_face')[0];
            console.log(firstCard);
            cardHasBeenFlipped = true;
        }else{
            // 2nd card
            secondCard =  $(this).find('.front_face')[0];
            console.log(firstCard, secondCard);
            cardHasBeenFlipped = false;

            // check if you have match
            if(
                $(`#${firstCard.id}`).attr("src") 
                == 
                $(`#${secondCard.id}`).attr("src")
                )
            {
                console.log("A Match!");
                
                $(`#${firstCard.id}`).parent().off("click");
                $(`#${secondCard.id}`).parent().off("click");
                // inc a global 
                // disable cards
            }else{
                console.log("Not A Match!");
                setTimeout(() => {
                    $(`#${firstCard.id}`).parent().removeClass("flip")
                    $(`#${secondCard.id}`).parent().removeClass("flip")
                }, 1000)
                // unflip cards
            }
        }
    })
}


$(document).ready(setup)
