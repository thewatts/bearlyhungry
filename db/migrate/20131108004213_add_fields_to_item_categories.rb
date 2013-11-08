class AddFieldsToItemCategories < ActiveRecord::Migration
  def change
    add_reference :item_categories, :item, index: true
    add_reference :item_categories, :category, index: true
  end
end
