import React from 'react';

function Home(){
    return(
        <div style={{ display: "flex", flexDirection: 'column', position: 'relative', height: 600, alignItems:'center', justifyContent:'center'}}>
            <button 
            onClick={() => alert('Scope 1 & 2 under development')}>
                Scope 1 & 2
            </button>
            &nbsp;
            <button 
            onClick={() => alert('Scope 1 & 2 Results is under development')}>
                View Scope 1 & 2
                Results
            </button>
        </div>
    );
}

export default Home