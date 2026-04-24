'use client';

import { SelectItem, SelectSeparator } from '@/components/ui/select';
import type { CollectionItemWithValues, CollectionField } from '@/types';
import type { ReferenceItemOption } from '@/lib/collection-field-utils';
import { COLLECTION_ITEM_KEYWORDS } from '@/lib/link-utils';

interface CollectionItemSelectOptionsProps {
  canUseCurrentPageItem: boolean;
  canUseCurrentCollectionItem: boolean;
  /**
   * Show "Next item" / "Previous item" entries. Only meaningful when the link
   * targets the same dynamic page that's being edited (so the navigation makes
   * sense relative to the current item). Caller is responsible for that gating.
   */
  canUseNextPreviousItem?: boolean;
  referenceItemOptions: ReferenceItemOption[];
  collectionItems: CollectionItemWithValues[];
  /** Fields for the linked page's collection, used to derive display names */
  collectionFields: CollectionField[];
}

function getDisplayName(item: CollectionItemWithValues, collectionFields: CollectionField[]): string {
  const nameField = collectionFields.find(f => f.key === 'name');
  if (nameField && item.values[nameField.id]) return item.values[nameField.id];
  const values = Object.values(item.values);
  return values[0] || item.id;
}

/**
 * Shared SelectContent items for CMS item pickers used in link settings.
 * Renders dynamic-resolution keywords ("Current page item", "Next item", …),
 * reference-field options, and the concrete item list.
 */
export default function LinkItemOptions({
  canUseCurrentPageItem,
  canUseCurrentCollectionItem,
  canUseNextPreviousItem = false,
  referenceItemOptions,
  collectionItems,
  collectionFields,
}: CollectionItemSelectOptionsProps) {
  const hasSpecialOptions =
    canUseCurrentPageItem ||
    canUseCurrentCollectionItem ||
    canUseNextPreviousItem ||
    referenceItemOptions.length > 0;

  return (
    <>
      {canUseCurrentPageItem && (
        <SelectItem value={COLLECTION_ITEM_KEYWORDS.CURRENT_PAGE}>
          <div className="flex items-center gap-2">Current page item</div>
        </SelectItem>
      )}
      {canUseCurrentCollectionItem && (
        <SelectItem value={COLLECTION_ITEM_KEYWORDS.CURRENT_COLLECTION}>
          <div className="flex items-center gap-2">Current collection item</div>
        </SelectItem>
      )}
      {canUseNextPreviousItem && (
        <>
          <SelectItem value={COLLECTION_ITEM_KEYWORDS.PREVIOUS_ITEM}>
            <div className="flex items-center gap-2">Previous item</div>
          </SelectItem>
          <SelectItem value={COLLECTION_ITEM_KEYWORDS.NEXT_ITEM}>
            <div className="flex items-center gap-2">Next item</div>
          </SelectItem>
        </>
      )}
      {referenceItemOptions.map((opt) => (
        <SelectItem key={opt.value} value={opt.value}>
          <div className="flex items-center gap-2">{opt.label}</div>
        </SelectItem>
      ))}
      {hasSpecialOptions && <SelectSeparator />}
      {collectionItems.map((item) => (
        <SelectItem key={item.id} value={item.id}>
          {getDisplayName(item, collectionFields)}
        </SelectItem>
      ))}
    </>
  );
}
