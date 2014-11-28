class AddDirections < ActiveRecord::Migration
  def change
  	add_column :rides, :directions, :text
  end
end
