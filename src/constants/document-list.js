import { DOCUMENT_TYPE, DOCUMENT_MARKER } from "~constants";

export default {
  sorted: [
    {
      id: 1,
      type: DOCUMENT_TYPE.SECTION,
      title: "Обязательные для всех",
      desc: "Документы, обязательные для всех сотрудников без исключения",
      marker: [
        DOCUMENT_MARKER.PINK,
        DOCUMENT_MARKER.YELLOW,
        DOCUMENT_MARKER.ORANGE,
      ],
      child: [
        {
          id: 1,
          type: DOCUMENT_TYPE.ITEM,
          title: "Паспорт",
          desc: "Для всех",
          important: true,
          marker: [DOCUMENT_MARKER.L_BLUE],
        },
        {
          id: 2,
          type: DOCUMENT_TYPE.ITEM,
          title: "ИНН",
          desc: "Для всех",
          important: true,
          marker: [],
        },
      ],
    },
    {
      id: 2,
      type: DOCUMENT_TYPE.SECTION,
      title: "Обязательные для трудоустройства",
      desc: "Документы, без которых невозможно трудоустройство человека на какую бы то ни было должность в компании вне зависимости от граждан",
      marker: [],
      child: [],
    },
    {
      id: 3,
      type: DOCUMENT_TYPE.SECTION,
      title: "Специальные",
      desc: "",
      marker: [],
      child: [],
    },
  ],
  unsorted: [
    {
      id: 4,
      type: DOCUMENT_TYPE.ITEM,
      title: "Тестовое задание кандидата",
      desc: "Россия, Белоруссия, Украина, администратор филиала, повар-сушист, повар-пиццмейкер, повар горячего цеха",
      important: false,
      marker: [],
    },
    {
      id: 5,
      type: DOCUMENT_TYPE.ITEM,
      title: "Трудовой договор",
      desc: "",
      important: false,
      marker: [DOCUMENT_MARKER.BLUE, DOCUMENT_MARKER.GRAY],
    },
    {
      id: 6,
      type: DOCUMENT_TYPE.ITEM,
      title: "Мед. книжка",
      desc: "",
      important: false,
      marker: [],
    },
  ],
};
