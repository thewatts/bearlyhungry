class CreateJobs < ActiveRecord::Migration
  def change
    create_table :jobs do |t|
      t.references :user
      t.references :restaurant
      t.references :role

      t.timestamps
    end
  end
end
