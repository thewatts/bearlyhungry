class AddTypeOfToCategories < ActiveRecord::Migration
  def change
    add_column :categories, :type_of, :string
  end
end
