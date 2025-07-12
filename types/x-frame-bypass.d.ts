declare module 'x-frame-bypass' {
  const xFrameBypass: any;
  export default xFrameBypass;
}

declare namespace JSX {
  interface IntrinsicElements {
    'x-frame-bypass': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      title?: string;
      onLoad?: () => void;
      onError?: () => void;
      style?: React.CSSProperties;
    };
  }
}
