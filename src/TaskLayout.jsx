import React from 'react';
import { Outlet, useNavigation, useLocation } from 'react-router-dom';
import HomeLoading from './loadingpages/HomeLoading';
import Home from './components/Home';
import Navigation from './navigation/Navigation';
import NavigationLoading from './navigation/NavigationLoading';

const TaskLayout = () => {
    const navigation = useNavigation();
    const location = useLocation(); // Access the current location/path

    const isLoading = navigation.state === 'loading';
    
    // Check if the current path is the home path
    const isNavHomePath = location.pathname === '/'

    return (
        <div className='task-ft-lay_comp w-full'>

            {isLoading ? (
                <NavigationLoading />
            ) : (
                <Navigation />
            )}

            <main>
                <Outlet /> 
                {isNavHomePath && <Home />} 
            </main>
            
        </div>
    );
}

export default TaskLayout;
