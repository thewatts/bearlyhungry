class AddDefaultValueForTextColumnToUsersTable < ActiveRecord::Migration
  def change
    change_column :users, :text, :boolean, :default => false
  end
end
