export declare const useRouter: () => {
    path: string;
    history: string[];
    push: (path: string) => void;
    replace: (path: string) => void;
    back: () => void;
    reload: () => void;
};
/**
 * @experimental
 * A Router component that feels like nextjs router for ink.
 * This router cannot render pages with depth.
 *
 * @author hmmhmmhm
 */
export declare const Router: () => JSX.Element;
export default Router;
