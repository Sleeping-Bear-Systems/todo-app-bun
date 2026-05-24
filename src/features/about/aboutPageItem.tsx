type SharedAboutPageItemProps = {
  label: string;
  url: string;
};

type LinkAboutPageItemProps = SharedAboutPageItemProps &
  Readonly<{
    type: "LinkAboutPageItemProps";
  }>;

type LinkWithIconAboutPageItemProps = SharedAboutPageItemProps &
  Readonly<{
    type: "LinkWithIconAboutPageItemProps";
    imageUrl: string;
  }>;

type AboutPageItemProps =
  | LinkAboutPageItemProps
  | LinkWithIconAboutPageItemProps;

export function AboutPageItem(props: AboutPageItemProps) {
  switch (props.type) {
    case "LinkAboutPageItemProps":
      return (
        <li>
          {props.label}:{" "}
          <a
            class="powered-by-link"
            href={props.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {props.url}
          </a>
        </li>
      );

    case "LinkWithIconAboutPageItemProps":
      return (
        <li>
          {props.label}:{" "}
          <a
            class="powered-by-link"
            href={props.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={props.imageUrl}
              alt=""
              width="16"
              height="16"
              aria-hidden="true"
            />
            {props.url}
          </a>
        </li>
      );
    default: {
      const _unknownType: never = props;
      return _unknownType;
    }
  }
}
