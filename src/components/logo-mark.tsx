const activeCells = new Set([1, 5, 7, 9, 11, 12, 13, 15, 17, 19, 23]);

export function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      {Array.from({ length: 25 }, (_, index) => (
        <span
          className="logo-pixel"
          data-active={activeCells.has(index)}
          key={index}
        />
      ))}
    </span>
  );
}
