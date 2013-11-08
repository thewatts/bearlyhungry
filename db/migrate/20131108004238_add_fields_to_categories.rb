class AddFieldsToCategories < ActiveRecord::Migration
  def change
    add_column :categories, :title, :string
  end
end
