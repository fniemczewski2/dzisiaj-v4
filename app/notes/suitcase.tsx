import PackingListScreen from "../../components/PackingListScreen";

const suitcaseCategories = [
  {
    title: "Odzież",
    items: [
      "T-shirty",
      "Koszule",
      "Sweter",
      "Bluza",
      "Spodnie długie",
      "Szorty",
      "Bielizna",
      "Skarpetki",
      "Piżama",
      "Kurtka",
      "Strój kąpielowy",
    ],
  },
  {
    title: "Obuwie",
    items: ["Buty codzienne", "Sandały", "Klapki", "Buty eleganckie"],
  },
  {
    title: "Bagaże i organizacja",
    items: ["Główna walizka", "Dodatkowe torby", "Nerka"],
  },
  {
    title: "Spanie",
    items: ["Koc podróżny", "Poduszka podróżna", "Hamak", "Śpiwór", "Karimata"],
  },
  {
    title: "Kosmetyczka",
    items: [
      "Szczoteczka do zębów",
      "Pasta do zębów",
      "Szampon / odżywka",
      "Żel pod prysznic",
      "Dezodorant",
      "Krem do twarzy",
      "Krem z filtrem",
      "Maszynka do golenia",
      "Grzebień",
      "Gumki, spinki",
    ],
  },
  {
    title: "Dokumenty i finanse",
    items: [
      "Dowód osobisty",
      "Paszport",
      "Karty płatnicze",
      "Gotówka",
      "Karta EKUZ",
      "Bilety / rezerwacje",
      "Ubezpieczenie",
    ],
  },
  {
    title: "Elektronika",
    items: [
      "Telefon + ładowarka",
      "Power bank",
      "Słuchawki",
      "Aparat",
      "Ładowarki i kable",
      "Generator kodów",
      "Adapter podróżny",
      "Grzałka elektryczna ",
    ],
  },
  {
    title: "Apteczka i higiena",
    items: [
      "Leki",
      "Plastry, bandaże",
      "Środki odkażające",
      "Chusteczki higieniczne",
      "Chusteczki mokre",
      "Płatki kosmetyczne",
      "Patyczki higieniczne",
      "Środek przeciw komarom/kleszczom",
    ],
  },
  {
    title: "Akcesoria i dodatki",
    items: [
      "Okulary przeciwsłoneczne",
      "Kapelusz / czapka",
      "Pasek",
      "Parasolka składana",
      "Biżuteria",
    ],
  },
  {
    title: "Rozrywka i inne",
    items: [
      "Książka",
      "Notes i długopis",
      "Gry / karty",
      "Mapa (offline)",
      "Filmy / muzyka",
    ],
  },
];

export default function SuitcaseScreen() {
  return <PackingListScreen title="Walizka" categories={suitcaseCategories} />;
}
