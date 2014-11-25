class CreateRides < ActiveRecord::Migration
  def change
    create_table :rides do |t|
    	t.integer :user_id, null: false
    	t.string :title, null: false
    	t.date :date, null: false

      t.timestamps
    end
  end
end
