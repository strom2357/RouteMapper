class AddUsername < ActiveRecord::Migration
  def change
	add_column :rides, :username, :string
  end
end
