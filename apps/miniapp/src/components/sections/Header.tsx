interface HeaderProps {
  title: string;
  city: string;
  userName?: string;
}

export function Header({ title, city, userName }: HeaderProps) {
  return (
    <header className="section header">
      <div className="header__top">
        <span className="header__badge">ENZINE</span>
        <span className="header__city">{city}</span>
      </div>
      <h1 className="header__title">{title}</h1>
      {userName && <p className="header__user">{userName}</p>}
    </header>
  );
}
