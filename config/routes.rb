Rails.application.routes.draw do
  root to: "rides#index"
  resources :users, only: [:new, :create]
  resources :sessions, only: [:new, :create, :destroy]
  
  namespace :api, defaults: { format: :json } do
	  resources :rides, only: [:new, :create, :index]
	end
end
