const { widget } = figma;
import { backIconSrc, minusIconSrc, nextIconSrc, plusIconSrc } from './icons';
const { AutoLayout, Input, Text, useSyncedState, SVG, usePropertyMenu } = widget;

function numToIndices(num: number): number[] {
  return new Array(num).fill(0).map((_, i) => i);
}

const pastelColors = [  
  '#edf2fb',
  '#ccdbfd',
  '#d7e3fc',
];


function shuffleArray(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Shuffle the pastelColors array once
const shuffledColors = shuffleArray([...pastelColors]);

function getColorFromList(index: number): string {
  return shuffledColors[index % shuffledColors.length];
}


// function getColorFromList(index: number): string {
//   return pastelColors[index % pastelColors.length];
// }

function Carousel() {
  const [numCards, setNumCards] = useSyncedState('numCards', 1);
  const [pageIndex, setPageIndex] = useSyncedState('pageIndex', 0);
  const [numPerRow, setNumPerRow] = useSyncedState('numPerRow', 1);
  const [numPerCol, setNumPerCol] = useSyncedState('numPerCol', 1);
  const [cardContents, setCardContents] = useSyncedState('cardContents', Array(numCards).fill(""));

  const cardsPerPage = numPerRow * numPerCol;
  const totalPages = Math.ceil(numCards / cardsPerPage);

  const propertyMenu: WidgetPropertyMenuItem[] = [
    {
      tooltip: 'Page: ' + (pageIndex + 1) + " of " + (totalPages),
      propertyName: 'count',
      itemType: 'action',
    },
    {
      tooltip: 'Cards: ' + numCards,
      propertyName: 'count',
      itemType: 'action',
    },
    {
      tooltip: 'Add Card',
      propertyName: 'incrementCards',
      itemType: 'action',
      icon: plusIconSrc,
    },
    {
      tooltip: 'Remove Card',
      propertyName: 'decrementCards',
      itemType: 'action',
      icon: minusIconSrc,
    },
    {
      tooltip: 'Cards Per Row: ' + numPerRow,
      propertyName: 'count',
      itemType: 'action',
    },
    {
      tooltip: 'Increment Row',
      propertyName: 'incrementRow',
      itemType: 'action',
      icon: plusIconSrc,
    },
    {
      tooltip: 'Decrement Row',
      propertyName: 'decrementRow',
      itemType: 'action',
      icon: minusIconSrc,
    },
    {
      tooltip: 'Cards Per Column: ' + numPerCol,
      propertyName: 'count',
      itemType: 'action',
    },
    {
      tooltip: 'Increment Column',
      propertyName: 'incrementCol',
      itemType: 'action',
      icon: plusIconSrc,
    },
    {
      tooltip: 'Decrement Column',
      propertyName: 'decrementCol',
      itemType: 'action',
      icon: minusIconSrc,
    }
  ];

  usePropertyMenu(propertyMenu, ({ propertyName }) => {
    if (propertyName === 'incrementCards') {
      setNumCards(numCards + 1);
      setCardContents([...cardContents, ""]); // Add a new empty card
    } else if (propertyName === 'decrementCards') {
      if (numCards >= 1) {
        if (numCards > 1){
          setNumCards(numCards - 1);
          setCardContents(cardContents.slice(0, -1));
        }
        if (numCards <= numPerRow){
          setNumPerRow(Math.max(numPerRow - 1, 1));
        }
        if (numCards <= numPerCol){
          setNumPerCol(Math.max(numPerCol - 1, 1));
        }
      }
    } else if (propertyName === 'incrementRow') {
      setNumPerRow(Math.min(numPerRow + 1, numCards)); // Max number of cards per row
    } else if (propertyName === 'decrementRow') {
      setNumPerRow(Math.max(numPerRow - 1, 1)); // Min 1 card per row
    } else if (propertyName === 'incrementCol') {
      setNumPerCol(Math.min(numPerCol + 1, Math.ceil(numCards / numPerRow))); // Max number of cards per column
    } else if (propertyName === 'decrementCol') {
      setNumPerCol(Math.max(numPerCol - 1, 1)); // Min 1 card per column
    }
  });

  const displayedCards = numToIndices(numCards).slice(
    pageIndex * cardsPerPage,
    (pageIndex + 1) * cardsPerPage
  );

  return (
    <AutoLayout
      cornerRadius={3}
      direction="vertical"
      fill="#FFFFFF"
      height="hug-contents"
      horizontalAlignItems="center"
      padding={8}
      spacing={6}
      verticalAlignItems="center"
    >
      <AutoLayout
        cornerRadius={3}
        direction="horizontal"
        fill="#FFFFFF"
        height="hug-contents"
        horizontalAlignItems="center"
        padding={8}
        spacing={12}
        verticalAlignItems="center"
      >
        <SVG
          src={backIconSrc}
          onClick={() => {
            setPageIndex((pageIndex - 1 + totalPages) % totalPages);
          }}
        />

        <AutoLayout
          direction="vertical"
          spacing={12}
        >
          <AutoLayout
            direction="horizontal"
            width={'fill-parent'}
            height={26}
          >

            <AutoLayout width={'fill-parent'}></AutoLayout>
            <Text fontSize={12}>
              {'Page: ' + (pageIndex + 1) + " of " + (totalPages)}
            </Text>

          </AutoLayout>

          {Array(numPerCol).fill(0).map((_, rowIndex) => (
            <AutoLayout
              key={rowIndex}
              direction="horizontal"
              spacing={12}
            >
              {displayedCards.slice(rowIndex * numPerRow, (rowIndex + 1) * numPerRow).map((cardIndex) => {
                const cardColor = getColorFromList(cardIndex);
              
                return (
                  <AutoLayout
                    key={cardIndex}
                    cornerRadius={3}
                    direction="vertical"
                    fill={cardColor}
                    padding={8}
                    spacing={4}
                  >
                    <Text fontSize={12} fill="#888">
                      {cardIndex + 1}
                    </Text>
                    <AutoLayout
                      width={'hug-contents'}
                      minHeight={100}
                      horizontalAlignItems={cardContents[cardIndex] == '' ? 'center' : 'start'}
                      verticalAlignItems={cardContents[cardIndex] == '' ? 'center' : 'start'}
                    >
                    <Input
                      //width={100}
                      inputFrameProps={{
                        padding: 10,
                        positioning: 'auto',
                      }}
                      onTextEditEnd={(e) => {
                        const newContents = [...cardContents];
                        newContents[cardIndex] = e.characters;
                        setCardContents(newContents);
                      }}
                      placeholder="                  Empty"
                      value={cardContents[cardIndex]}
                      fontSize={14}
                    />
                    </AutoLayout>
                  </AutoLayout>
                );
              })}
            </AutoLayout>
          ))}

          {(numPerRow > 6) &&  (numPerCol > 2) && (
          <AutoLayout
            direction="horizontal"
            width={'fill-parent'}
            height={26}
          >

            <AutoLayout width={'fill-parent'}></AutoLayout>
            
            <Text fontSize={12}>
              {'Page: ' + (pageIndex + 1) + " of " + (totalPages)}
            </Text>

          </AutoLayout>
          )}

        </AutoLayout>

        <SVG
          src={nextIconSrc}
          onClick={() => {
            setPageIndex((pageIndex + 1) % totalPages);
          }}
        />
      </AutoLayout>

    </AutoLayout>
  );
}

widget.register(Carousel);
