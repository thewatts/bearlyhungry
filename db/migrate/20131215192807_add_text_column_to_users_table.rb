class AddTextColumnToUsersTable < ActiveRecord::Migration
  def change
    add_column :users, :text, :boolean
  end
end
