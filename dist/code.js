"use strict";
(() => {
  // widget-src/icons.tsx
  var { widget } = figma;
  var nextIconSrc = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5l7 7-7 7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;
  var backIconSrc = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 19l-7-7 7-7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;
  var minusIconSrc = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="7" width="12" height="2" fill="white"/>
  </svg>
`;
  var plusIconSrc = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3v10M3 8h10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

  // widget-src/code.tsx
  var { widget: widget2 } = figma;
  var { AutoLayout, Input, Text, useSyncedState, SVG, usePropertyMenu } = widget2;
  function numToIndices(num) {
    return new Array(num).fill(0).map((_, i) => i);
  }
  var pastelColors = [
    "#edf2fb",
    "#ccdbfd",
    "#d7e3fc"
  ];
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  var shuffledColors = shuffleArray([...pastelColors]);
  function getColorFromList(index) {
    return shuffledColors[index % shuffledColors.length];
  }
  function Carousel() {
    const [numCards, setNumCards] = useSyncedState("numCards", 1);
    const [pageIndex, setPageIndex] = useSyncedState("pageIndex", 0);
    const [numPerRow, setNumPerRow] = useSyncedState("numPerRow", 1);
    const [numPerCol, setNumPerCol] = useSyncedState("numPerCol", 1);
    const [cardContents, setCardContents] = useSyncedState("cardContents", Array(numCards).fill(""));
    const cardsPerPage = numPerRow * numPerCol;
    const totalPages = Math.ceil(numCards / cardsPerPage);
    const propertyMenu = [
      {
        tooltip: "Page: " + (pageIndex + 1) + " of " + totalPages,
        propertyName: "count",
        itemType: "action"
      },
      {
        tooltip: "Cards: " + numCards,
        propertyName: "count",
        itemType: "action"
      },
      {
        tooltip: "Add Card",
        propertyName: "incrementCards",
        itemType: "action",
        icon: plusIconSrc
      },
      {
        tooltip: "Remove Card",
        propertyName: "decrementCards",
        itemType: "action",
        icon: minusIconSrc
      },
      {
        tooltip: "Cards Per Row: " + numPerRow,
        propertyName: "count",
        itemType: "action"
      },
      {
        tooltip: "Increment Row",
        propertyName: "incrementRow",
        itemType: "action",
        icon: plusIconSrc
      },
      {
        tooltip: "Decrement Row",
        propertyName: "decrementRow",
        itemType: "action",
        icon: minusIconSrc
      },
      {
        tooltip: "Cards Per Column: " + numPerCol,
        propertyName: "count",
        itemType: "action"
      },
      {
        tooltip: "Increment Column",
        propertyName: "incrementCol",
        itemType: "action",
        icon: plusIconSrc
      },
      {
        tooltip: "Decrement Column",
        propertyName: "decrementCol",
        itemType: "action",
        icon: minusIconSrc
      }
    ];
    usePropertyMenu(propertyMenu, ({ propertyName }) => {
      if (propertyName === "incrementCards") {
        setNumCards(numCards + 1);
        setCardContents([...cardContents, ""]);
      } else if (propertyName === "decrementCards") {
        if (numCards >= 1) {
          if (numCards > 1) {
            setNumCards(numCards - 1);
            setCardContents(cardContents.slice(0, -1));
          }
          if (numCards <= numPerRow) {
            setNumPerRow(Math.max(numPerRow - 1, 1));
          }
          if (numCards <= numPerCol) {
            setNumPerCol(Math.max(numPerCol - 1, 1));
          }
        }
      } else if (propertyName === "incrementRow") {
        setNumPerRow(Math.min(numPerRow + 1, numCards));
      } else if (propertyName === "decrementRow") {
        setNumPerRow(Math.max(numPerRow - 1, 1));
      } else if (propertyName === "incrementCol") {
        setNumPerCol(Math.min(numPerCol + 1, Math.ceil(numCards / numPerRow)));
      } else if (propertyName === "decrementCol") {
        setNumPerCol(Math.max(numPerCol - 1, 1));
      }
    });
    const displayedCards = numToIndices(numCards).slice(
      pageIndex * cardsPerPage,
      (pageIndex + 1) * cardsPerPage
    );
    return /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        cornerRadius: 3,
        direction: "vertical",
        fill: "#FFFFFF",
        height: "hug-contents",
        horizontalAlignItems: "center",
        padding: 8,
        spacing: 6,
        verticalAlignItems: "center"
      },
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          cornerRadius: 3,
          direction: "horizontal",
          fill: "#FFFFFF",
          height: "hug-contents",
          horizontalAlignItems: "center",
          padding: 8,
          spacing: 12,
          verticalAlignItems: "center"
        },
        /* @__PURE__ */ figma.widget.h(
          SVG,
          {
            src: backIconSrc,
            onClick: () => {
              setPageIndex((pageIndex - 1 + totalPages) % totalPages);
            }
          }
        ),
        /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            direction: "vertical",
            spacing: 12
          },
          /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              direction: "horizontal",
              width: "fill-parent",
              height: 26
            },
            /* @__PURE__ */ figma.widget.h(AutoLayout, { width: "fill-parent" }),
            /* @__PURE__ */ figma.widget.h(Text, { fontSize: 12 }, "Page: " + (pageIndex + 1) + " of " + totalPages)
          ),
          Array(numPerCol).fill(0).map((_, rowIndex) => /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              key: rowIndex,
              direction: "horizontal",
              spacing: 12
            },
            displayedCards.slice(rowIndex * numPerRow, (rowIndex + 1) * numPerRow).map((cardIndex) => {
              const cardColor = getColorFromList(cardIndex);
              return /* @__PURE__ */ figma.widget.h(
                AutoLayout,
                {
                  key: cardIndex,
                  cornerRadius: 3,
                  direction: "vertical",
                  fill: cardColor,
                  padding: 8,
                  spacing: 4
                },
                /* @__PURE__ */ figma.widget.h(Text, { fontSize: 12, fill: "#888" }, cardIndex + 1),
                /* @__PURE__ */ figma.widget.h(
                  AutoLayout,
                  {
                    width: "hug-contents",
                    minHeight: 100,
                    horizontalAlignItems: cardContents[cardIndex] == "" ? "center" : "start",
                    verticalAlignItems: cardContents[cardIndex] == "" ? "center" : "start"
                  },
                  /* @__PURE__ */ figma.widget.h(
                    Input,
                    {
                      inputFrameProps: {
                        padding: 10,
                        positioning: "auto"
                      },
                      onTextEditEnd: (e) => {
                        const newContents = [...cardContents];
                        newContents[cardIndex] = e.characters;
                        setCardContents(newContents);
                      },
                      placeholder: "                  Empty",
                      value: cardContents[cardIndex],
                      fontSize: 14
                    }
                  )
                )
              );
            })
          )),
          numPerRow > 6 && numPerCol > 2 && /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              direction: "horizontal",
              width: "fill-parent",
              height: 26
            },
            /* @__PURE__ */ figma.widget.h(AutoLayout, { width: "fill-parent" }),
            /* @__PURE__ */ figma.widget.h(Text, { fontSize: 12 }, "Page: " + (pageIndex + 1) + " of " + totalPages)
          )
        ),
        /* @__PURE__ */ figma.widget.h(
          SVG,
          {
            src: nextIconSrc,
            onClick: () => {
              setPageIndex((pageIndex + 1) % totalPages);
            }
          }
        )
      )
    );
  }
  widget2.register(Carousel);
})();
