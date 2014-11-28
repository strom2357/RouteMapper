class AddDirections < ActiveRecord::Migration
  def change
  	add_column :rides, :directions, :string
  end
end
