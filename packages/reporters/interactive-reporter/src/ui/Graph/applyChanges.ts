import { action } from 'mobx';

import { Store } from '../../model/store';

export const applyNodeChangesToStore = action((store: Store, changes: any[]) => {
    // we need this hack to handle the setNodes and setEdges function of the useReactFlow hook for controlled flows
    if (changes.some((c) => c.type === 'reset')) {
        return changes.filter((c) => c.type === 'reset').map((c) => c.item);
    }

    const nodes = store.fullGraph.nodes;

    for (const currentChange of changes) {
        const currentNode = nodes.find((n) => n.id === currentChange.id);

        if (!currentNode) {
            return;
        }

        switch (currentChange.type) {
            case 'select': {
                currentNode.selected = currentChange.selected;
                break;
            }
            case 'position': {
                if (typeof currentChange.position !== 'undefined') {
                    currentNode.position = currentChange.position;
                }

                if (typeof currentChange.positionAbsolute !== 'undefined') {
                    currentNode.positionAbsolute = currentChange.positionAbsolute;
                }

                if (typeof currentChange.dragging !== 'undefined') {
                    currentNode.dragging = currentChange.dragging;
                }
                break;
            }
            case 'dimensions': {
                if (typeof currentChange.dimensions !== 'undefined') {
                    currentNode.width = currentChange.dimensions.width;
                    currentNode.height = currentChange.dimensions.height;
                }
            }
        }
    }
});
