/**
 * InterfaceFacade — adapter exposing legacy Interface API for code.js
 *
 * Provides three sub-objects: dialog, quest, inventory.
 * Each delegates to the actual Interface implementation.
 */

export interface InterfaceFacade {
  dialog: {
    set(entries: any[], callback?: () => void): void;
  };
  quest: {
    set(text: string): void;
  };
  inventory: {
    show(): void;
    delete(itemId: number, count: number): void;
  };
}

export function createInterfaceFacade(iface: any): InterfaceFacade {
  return {
    dialog: {
      set(entries: any[], callback?: () => void): void {
        iface.dialog.set(entries, callback);
      },
    },
    quest: {
      set(text: string): void {
        iface.quest.set(text);
      },
    },
    inventory: {
      show(): void {
        iface.inventory.show();
      },
      delete(itemId: number, count: number): void {
        iface.inventory.delete(itemId, count);
      },
    },
  };
}
